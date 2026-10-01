export type VisitReason =
  | "X-Ray"
  | "Electrocardiogram"
  | "Cath Lab"
  | "Stat Lab";

export type VisitStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED";

export type Visit = {
  id: string;

  first_name: string;
  last_name: string;

  reason: VisitReason;

  status: VisitStatus;

  assigned_to: string | null;

  created_at: string;
  assigned_at: string | null;
  completed_at: string | null;
};

export type QueueVisit = {
  id: string;
  first_name: string;
  last_name: string;
  reason: VisitReason;
  status: VisitStatus;
  assigned_to: string | null;
  created_at: string;
  assigned_at: string | null;
  completed_at: string | null;
  assigned_employee: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
};

export type Employee = {
  id: string;
  epic_user_id: string;
  first_name: string | null;
  last_name: string | null;
};
