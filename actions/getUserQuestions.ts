"use server";

import { db } from "@/lib/db";
import { GetUserQuestionsPayload, GetUserQuestionsValidator } from "@/lib/validators/question";

export const getUserQuestions = async (payload: GetUserQuestionsPayload) => {
    try {
        const validatedFields = GetUserQuestionsValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const { userId, tab } = validatedFields.data;
        let orderByCaluse = {};

        const user = await db.user.findUnique({
            where: {
                id: userId
            }
        });
        if(!user) throw new Error("User not found");

        if (tab === "score") {
            orderByCaluse = {
                votes: { _count: "desc" }
            };
        } else if (tab === "newest") {
            orderByCaluse = { askedAt: "desc" };
        } else if (tab === "views") {
            orderByCaluse = {};
        }

        const questions = await db.question.findMany({
            where: {
                askerId: userId
            },
            orderBy: orderByCaluse,
            take: 5,
            select: {
                id: true,
                title: true,
                askedAt: true
            }
        });

        const totalQuestions = await db.question.count({
            where: { askerId: userId }
        });

        return { questions, totalQuestions };
    } catch (error) {
        console.log(error);

        throw new Error("Something went wrong");
    }
};