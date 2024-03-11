import { getConnection } from "@/config/database/mongo";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const conn = await getConnection();
  const coll = conn.db.collection("answers");

  const params = new URL(request.url).searchParams;
  const code = params.get("code");

  if (!code) {
    return Response.json(
      {
        message: "Code is required",
      },
      { status: 400 }
    );
  }

  const quizAnswers = await coll
    .find({ questionCode: code })
    .sort({
      totalPoints: -1,
    })
    .limit(20)
    .project({
      _id: 0,
      name: 1,
      email: 1,
      totalPoints: 1,
    })
    .toArray();

  return Response.json(quizAnswers);
}
