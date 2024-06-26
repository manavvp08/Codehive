"use client";

import Link from 'next/link';
import { MdOutlineEdit } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import Loader from '@/components/Loader';
import PostTabsLink from '../PostTabsLink';
import EditTagDialog from './EditTagDialog';
import PaginationBox from '@/components/PaginationBox';
import {
    USERS_TAGS_PER_PAGE,
    userSummaryTagsTabs
} from '@/constants';
import { TagsData } from '@/types/user';
import { Badge } from '@/components/ui/Badge';
import { getUserTags } from '@/actions/user/getUserTags';

interface TagsContentProps {
    userId: string;
    profileName: string;
    username: string;
    isCurrentUser: boolean;
}

type Sort = "used" | "watched" | "ignored" | "created";

const TagsContent = ({
    userId,
    profileName,
    username,
    isCurrentUser
}: TagsContentProps) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const sort = searchParams.get("sort") || "used";
    
    const fetchTags = async () => {
        const payload = { userId, sort: sort as Sort, page: Number(page), limit: USERS_TAGS_PER_PAGE };
        const data = await getUserTags(payload);
        return data as TagsData;
    };

    const {
        data,
        isFetching
    } = useQuery({
        queryKey: ["users", username, { tab: "tags", sort }],
        queryFn: fetchTags
    });

    if(isFetching) return <Loader type="half" />
    if(!data) return <div className="flex-1 text-center py-10 text-zinc-400 text-[15px]">Something went wrong</div>

    return (
        <div className="flex-1">
            <div className="flex items-end justify-between flex-wrap gap-1.5 mb-2">
                <h3 className="text-lg sm:text-xl text-zinc-800 -mb-1.5 sm:-mb-1">
                    {data.tags.length === 1 ? "1 Tag" : `${data.tags.length} Tags`}
                </h3>
                <PostTabsLink
                    tabs={userSummaryTagsTabs}
                    value={sort}
                    route={`/users/${username}?tab=tags`}
                />
            </div>

            <ul className="border border-zinc-300 rounded-md mb-4">
                {data.tags.length ? (
                    data.tags.map((tag, index) => (
                        <li key={index} className={`group p-4 flex items-center justify-between ${index === data.tags.length - 1 ? "" : "border-b border-zinc-300"}`}>
                            <Link href={`/questions/tagged/${tag.name}`}>
                                <Badge variant="secondary">{tag.name}</Badge>
                            </Link>
                            <div className="flex items-center gap-3">
                                {(isCurrentUser && tag.creatorId === userId) && (
                                    <EditTagDialog
                                        initialName={tag.name}
                                        initialDescription={tag.description}
                                    >
                                        <MdOutlineEdit
                                            title="Edit this tag"
                                            className="opacity-0 h-6 w-6 p-1 bg-zinc-50 text-zinc-800 rounded-sm group-hover:opacity-100 hover:bg-zinc-100"
                                        />
                                    </EditTagDialog>
                                )}
                                <p title={`${tag.questionIds.length} ${tag.questionIds.length === 1 ? "question" : "questions"} tagged with this tag`} className="text-zinc-600 text-sm">
                                    {tag.questionIds.length} {tag.questionIds.length === 1 ? "post" : "posts"}
                                </p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="px-4 py-10 text-center text-sm text-zinc-600">
                        {isCurrentUser ? "You have" : `${profileName} has`} not {sort} any tags
                    </p>
                )}
            </ul>

            {data.tags.length > 0 && (
                <PaginationBox
                    location={`/users/${username}?tab=tags&sort=${sort}&`}
                    currentPage={Number(page)}
                    lastPage={data.lastPage}
                />
            )}
        </div>
    )
}

export default TagsContent;