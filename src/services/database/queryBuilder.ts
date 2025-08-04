import { collection, query, where, QueryConstraint, type WhereFilterOp } from "firebase/firestore";
import { db } from "../firebase";

type WhereClause = [fieldPath: string, opStr: WhereFilterOp, value: any];

export const buildQuery = (collectionName: string, whereClauses: WhereClause[]) => {
  const constraints: QueryConstraint[] = whereClauses.map(
    ([fieldPath, opStr, value]) => where(fieldPath, opStr, value)
  );
  return query(collection(db, collectionName), ...constraints);
};