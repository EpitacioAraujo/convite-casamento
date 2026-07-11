export default function InfoSection() {
  return (
    <section id="info" className="section-info">
      <div className="container">
        <div className="info-grid">
          <div className="info-card">
            <h3>Traje: Esporte Fino</h3>
            <p>Queremos que todos estejam confortáveis e elegantes para celebrar esse momento conosco. Por isso recomendamos que todos os convidados usem roupas no estilo esporte fino.</p>
            <p style={{ marginTop: '0.75rem' }}><b>Importante:</b> As madrinhas usarão amarelo manteiga. Com carinho pedimos que as convidadas optem por outras cores. Os padrinhos terno na cor preta e gravata amarelo claro/champagne ou parecido.</p>
          </div>
          <div className="info-card">
            <h3>Dicas Importantes</h3>
            <ul className="info-list faq-list">
              <li>
                <b>Confirmação obrigatória:</b>
                <p>Pedimos a gentileza de confirmar até o dia <strong>03/08</strong> para dimensionarmos o buffet.</p>
              </li>
              <li>
                <b>Estacionamento:</b>
                <p>O evento é realizado em uma avenida onde é possível estacionar nas proximidades.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
