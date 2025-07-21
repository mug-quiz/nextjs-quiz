import { getConnection } from '@/lib/database/mongo';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, context: any) {
  const conn = await getConnection();
  const collection = conn.db.collection('quiz');

  const urlParams = context.params;

  if (!ObjectId.isValid(urlParams.id)) {
    return Response.json(
      {
        message: 'Invalid quizz id',
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
        message: 'Quiz not found',
      },
      { status: 404 }
    );
  }

  const questions = quiz.questions.map((question: any) => {
    return {
      id: question.id,
      question: question.question,
      alternatives: question.alternatives,
    };
  });

  return Response.json(questions);
}
export interface Question {
  id: ObjectId;
  question: string;
  alternatives: { id: string; text: string; order: number }[];
  quizId: string;
  correctAlternativeId: string;
}
export async function POST(request: Request) {
  const conn = await getConnection();
  const collection = conn.db.collection('quiz');

  const { question, alternatives, quizId, correctAlternativeId } =
    (await request.json()) as Question;

  if (!question || !alternatives || !quizId || !correctAlternativeId) {
    return Response.json(
      {
        message: 'Invalid data',
      },
      { status: 400 }
    );
  }

  const quiz = await collection.findOne({
    _id: ObjectId.createFromHexString(quizId),
  });

  if (!quiz) {
    return Response.json(
      {
        message: 'Quiz not found',
      },
      { status: 404 }
    );
  }

  alternatives.every((alternative) => {
    if (!alternative.text || !alternative.id || !alternative.order) {
      return Response.json(
        {
          message: 'Invalid data',
        },
        { status: 400 }
      );
    }
    if (alternatives.filter((a) => a.id === alternative.id).length > 1) {
      return Response.json(
        {
          message: 'Duplicate alternative id',
        },
        { status: 400 }
      );
    }
  });

  if (!alternatives.find((a) => a.id === correctAlternativeId)) {
    return Response.json(
      {
        message: 'Correct alternative not found',
      },
      { status: 400 }
    );
  }

  const result = await collection.updateOne(
    { _id: ObjectId.createFromHexString(quizId) },
    {
      $addToSet: {
        questions: {
          id: new ObjectId(),
          question,
          alternatives,
          correctAlternativeId,
        },
      },
    }
  );

  return Response.json(result);
}

export async function OPTIONS(request: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
