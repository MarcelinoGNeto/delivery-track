import { TOKEN } from "@/constants";
import { useSearchCustomer } from "@/hooks/useCustomer";
import { Customer } from "@/types";

interface Props {
  phone: string;
  setPhone: (phone: string) => void;
  onFound: (customer: Customer) => void;
  onNotFound: () => void;
}

export function SearchStep({ phone, setPhone, onFound, onNotFound }: Props) {
  const { mutate, isPending, error } = useSearchCustomer(TOKEN);

  const handleSearch = () => {
    mutate(phone, {
      onSuccess: (customer) => {
        if (customer) onFound(customer);
        else onNotFound();
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefone"
        className="border p-3"
      />

      <button
        className="bg-green-600 text-white p-3"
        onClick={handleSearch}
        disabled={isPending}
      >
        {isPending ? "Buscando..." : "Buscar"}
      </button>

      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
