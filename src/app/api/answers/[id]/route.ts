import { getConnection } from "@/config/database/mongo";
import { ObjectId } from "mongodb";

interface Answers {
  endTimestamp: number;
  startedTimestamp: number;
  value: string;
}

export async function POST(request: Request, context: any) {
  const urlParams = context.params;

  if (!ObjectId.isValid(urlParams.id)) {
    return Response.json(
      {
        message: "Invalid answer id",
      },
      { status: 400 }
    );
  }

  const questionsAnswers = await request.json();

  const conn = await getConnection();
  const coll = conn.db.collection("answers");
  const collQuizze = conn.db.collection("quiz");

  const answer = await coll.findOne({
    _id: ObjectId.createFromHexString(urlParams.id),
  });

  if (!answer) {
    return Response.json(
      {
        message: "Answer not found",
      },
      { status: 404 }
    );
  }

  const quiz = await collQuizze.findOne({
    code: answer.questionCode,
  });

  if (!quiz) {
    return Response.json(
      {
        message: "Quiz not found",
      },
      { status: 404 }
    );
  }

  console.log(quiz.questions);
  console.log(questionsAnswers);

  if (quiz.questions.length < questionsAnswers.length) {
    return Response.json(
      {
        message: "Invalid number of answers",
      },
      { status: 400 }
    );
  }

  const answersWCorrect = questionsAnswers.map((data: any, index: number) => {
    const isCorrect = quiz.questions[index].correctAlternativeId === data.value;
    const totalTime = data.endTimestamp - data.startTimestamp;
    const points = isCorrect ? 100 - totalTime : 0;

    return {
      answer: data.value,
      totalTime,
      answerId: data.questionId,
      correct: isCorrect,
      correctValue: quiz.questions[index].correctAlternativeId,
      points: points < 0 ? 0 : points,
    };
  });

  const totalPoints = answersWCorrect.reduce((acc: number, curr: any) => {
    return acc + curr.points;
  }, 0);

  const inserted = coll.updateOne(
    {
      _id: ObjectId.createFromHexString(urlParams.id),
    },
    {
      $set: {
        answers: answersWCorrect,
        totalPoints,
      },
    }
  );

  const _return = await coll.findOne({
    _id: ObjectId.createFromHexString(urlParams.id),
  });

  return Response.json(_return, { status: 200 });
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
