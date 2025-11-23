using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SagradoAbadAPP.Modelos
{
    public class Orden
    {

        public string Id { get; set; }
        public string UsuarioId { get; set; }

        public DateTime FechaOrden { get; set; } = DateTime.Now;


        public decimal Total { get; set; }

        public string MetodoPago { get; set; }

        public string EstadoEnvio { get; set; }
    }
}
