export default function InfoSection() {
  return (
    <section id="info" className="section-info">
      <div className="container">
        <div className="info-grid">
          <div className="info-card">
            <h3>Traje: Esporte Fino</h3>
            <p>Recomendamos que nossos convidados usem trajes no estilo <b>Esporte Fino</b>.</p>
            <ul className="info-list">
              <li><b>Para elas:</b> Vestidos curtos ou midi, macacões sofisticados, tecidos leves e fluidos.</li>
              <li><b>Para eles:</b> Calça social ou de sarja, camisa social, paletó (opcional, sem necessidade de gravata).</li>
              <li><b>Dica:</b> O local da recepção possui áreas gramadas, sugerimos saltos mais grossos para maior conforto.</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>Dicas Importantes</h3>
            <ul className="info-list faq-list">
              <li>
                <b>Hospedagem próxima:</b>
                <p>Para quem vem de fora de Fortaleza, há diversas opções de hotéis na região da Maraponga.</p>
              </li>
              <li>
                <b>Confirmação obrigatória:</b>
                <p>Pedimos a gentileza de confirmar até o dia 21 de setembro para dimensionarmos o buffet.</p>
              </li>
              <li>
                <b>Estacionamento:</b>
                <p>O local da recepção possui serviço de valet gratuito com estacionamento seguro no local.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
