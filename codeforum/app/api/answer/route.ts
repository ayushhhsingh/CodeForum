import { answerCollection, db } from "@/models/name";
import type { UserPrefs } from "@/models/user";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
};

const getErrorStatus = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const status = "status" in error ? error.status : undefined;
    const code = "code" in error ? error.code : undefined;

    if (typeof status === "number") {
      return status;
    }

    if (typeof code === "number") {
      return code;
    }
  }

  return 500;
};

export async function POST(request: NextRequest){
  try {
    const {questionId, answer, authorId} = await request.json();

    const response = await databases.createDocument(db, answerCollection, ID.unique(), {
      content: answer,
      authorId: authorId,
      questionId: questionId
    })

    // Increase author reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId)
    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1
    })

    return NextResponse.json(response, {
      status: 201
    })

  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: getErrorMessage(error) || "Error creating answer"
      },
      {
        status: getErrorStatus(error)
      }
    )
  }
}

export async function DELETE(request: NextRequest){
  try {
    const {answerId} = await request.json()

    const answer = await databases.getDocument(db, answerCollection, answerId)

    const response = await databases.deleteDocument(db, answerCollection, answerId)

    //decrese the reputation
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId)
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1
    })

    return NextResponse.json(
      {data: response},
      {status: 200}
  )



  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: getErrorMessage(error) || "Error deleting the answer"
      },
      {
        status: getErrorStatus(error)
      }
    )
  }
}
