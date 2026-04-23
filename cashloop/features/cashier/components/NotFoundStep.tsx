type Props = {
  phone: string;
  onCreate: () => void;
  onBack: () => void;
};

export function NotFoundStep({ phone, onCreate, onBack }: Props) {
  return (
    <>
      <h1 className="text-xl font-bold">Cliente não encontrado</h1>

      <p>{phone}</p>

      <button
        onClick={onCreate}
        className="bg-green-600 text-white p-3"
      >
        Criar cliente
      </button>

      <button onClick={onBack}>Voltar</button>
    </>
  );
}