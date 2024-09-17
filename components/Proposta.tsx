import { Proposta as Prop } from '@/interfaces/Proposta';
import axios from 'axios';

function Proposta(prop: Readonly<Prop>) {
  const link = prop.link_pdf;
  const downloadPdf = async () => {
    const res = await axios.get(link, { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = prop.proposta;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div className="bg-azul w-full flex items-center justify-between rounded-md px-3 py-2">
      <div>
        <p className="text-white text-xl font-semibold">{prop.proposta}</p>
        <p className="text-white text-lg font-normal">{prop.nomeEmpresa}</p>
      </div>
      <div className="text-right">
        <p className="text-white text-xl font-semibold">{prop.data}</p>
        <p className="text-white text-md font-normal">
          Enviada por: {prop.nomeVendedor}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          className="w-fit font-semibold border border-[#ffffffa6] hover:bg-[#ffffff16] transition-all text-white rounded-md p-2"
          onClick={() => window.open(prop.link_pdf, '_blank')}
        >
          Ver
        </button>
        <button
          className="w-fit font-semibold border bg-[#ffffffa6] text-azul transition-all hover:opacity-60 rounded-md p-2"
          onClick={downloadPdf}
        >
          Baixar
        </button>
      </div>
    </div>
  );
}

export default Proposta;
