import { getConnection } from "@/config/database/mongo";

interface Answer {
  email: string;
  questionCode: string;
  name: string;
}

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);

  const conn = await getConnection();
  const collection = conn.db.collection("answers");
  const quizzesColl = conn.db.collection("quiz");

  const { email, questionCode, name } = body as Answer;

  if (!email || !questionCode || !name) {
    return Response.json(
      {
        message: "Invalid data",
      },
      { status: 400 }
    );
  }

  const findAnswer = await collection.findOne({ email, questionCode });

  if (findAnswer) {
    return Response.json(findAnswer);
  }

  const quiz = await quizzesColl.findOne({ code: questionCode });

  if (!quiz) {
    return Response.json(
      {
        message: "Quiz not found",
      },
      { status: 404 }
    );
  }

  const insertedAnswer = await collection.insertOne({
    email,
    questionCode,
    name,
    startedAt: new Date().getTime(),
  });

  const _return = await collection.findOne({ _id: insertedAnswer.insertedId });

  return Response.json({ ..._return, quizId: quiz._id });
}

export async function OPTIONS(request: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
