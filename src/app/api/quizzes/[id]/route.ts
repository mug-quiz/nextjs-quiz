import { getConnection } from "@/config/database/mongo";
import { ObjectId } from "mongodb";

export async function GET(request: Request, context: any) {
  const conn = await getConnection();
  const collection = conn.db.collection("quiz");

  const urlParams = context.params;

  if (!ObjectId.isValid(urlParams.id)) {
    return Response.json(
      {
        message: "Invalid quizz id",
      },
      { status: 400 }
    );
  }

  const quiz = await collection.findOne({
    _id: ObjectId.createFromHexString(urlParams.id),
  });

  if (!quiz) {
    return Response.json(
      {
        message: "Quiz not found",
      },
      { status: 404 }
    );
  }

  return Response.json(quiz);
}
