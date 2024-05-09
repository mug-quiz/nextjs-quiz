import { getConnection } from '@/lib/database/mongo';

export async function GET(request: Request) {
  const conn = await getConnection();
  const collection = conn.db.collection('quiz');
  const params = new URL(request.url).searchParams;
  const code = params.get('code');

  if (!code) {
    return Response.json(
      {
        message: 'Code is required',
      },
      { status: 400 }
    );
  }

  const quiz = await collection.findOne({ code }, { projection: { _id: 0 } });

  return Response.json(quiz);
}

interface quiz {
  name: string;
  description?: string;
  launchDate: Date;
  code: string;
}

export async function POST(request: Request) {
  const body = await request.json();

  const conn = await getConnection();
  const collection = conn.db.collection('quiz');

  const { name, description, launch_date, code } = body;

  if (!name || !launch_date || !code) {
    return Response.json(
      {
        message: 'Invalid data',
      },
      { status: 400 }
    );
  }

  const findQuizByCode = await collection.findOne({ code });
  if (findQuizByCode) {
    return Response.json(
      {
        message: 'Code already in use',
      },
      { status: 400 }
    );
  }

  if (new Date(launch_date).getTime() < Date.now()) {
    return Response.json(
      {
        message: 'Invalid launch date',
      },
      { status: 400 }
    );
  }

  const quiz: quiz = {
    name,
    description: description?.toString() || '',
    launchDate: new Date(launch_date),
    code,
  };

  const inserted = await collection.insertOne(quiz);
  const _return = await collection.findOne({ _id: inserted.insertedId });

  return Response.json(_return);
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
