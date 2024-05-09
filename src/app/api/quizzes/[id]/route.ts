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

  return Response.json(quiz);
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
