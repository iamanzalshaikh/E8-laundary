// Redis is disabled in this deployment.
// This file exists only so imports keep working without any Redis dependency.

type Ok = "OK";

const noopGet = async (_key: string): Promise<string | null> => {
  return null;
};

const noopSet = async (_key: string, _value: string, ..._args: unknown[]): Promise<Ok> => {
  return "OK";
};

const noopDel = async (_key: string): Promise<number> => {
  return 0;
};

const redis = {
  get: noopGet,
  set: noopSet,
  del: noopDel,
};

export default redis;
