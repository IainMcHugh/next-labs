type RecordProps = {
  id: string;
  message: string;
};

const record = async ({ id, message }: RecordProps) => {
  await fetch(`/api/lab/record?id=${id}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
};

const labnotes = {
  record,
};

export { labnotes };
