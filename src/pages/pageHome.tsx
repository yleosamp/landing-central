import { useState, useEffect, useRef, CSSProperties } from 'react';
import { motion } from 'framer-motion'; // Importa o motion

const headerStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 40px',
  paddingTop: '20px',
  backgroundColor: '#000000',
  color: '#FFFFFF',
  zIndex: 1000
};

const logoStyle: CSSProperties = {
  width: '30px',
  height: '30px',
  marginRight: '10px'
};

const navLinkStyle: CSSProperties = {
  color: '#FFFFFF',
  textDecoration: 'none',
  marginLeft: '20px',
  transition: 'color 0.3s'
};

const mainContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '90vh',
  backgroundColor: '#000000',
  color: '#FFFFFF',
  padding: '20px',
  paddingTop: '80px'
};

const contentContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto'
};

const logoContainerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const textContainerStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingLeft: '40px'
};

const buttonStyle: CSSProperties = {
  backgroundColor: '#4ECB71',
  color: '#1D4A2A',
  padding: '10px 20px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1em',
  marginRight: '20px',
  transition: 'background-color 0.3s',
  boxShadow: '0 0 24px #4ECB71' // Adicionado glow nos botões verdes
};

const secondaryButtonStyle: CSSProperties = {
  backgroundColor: 'transparent',
  color: '#FFFFFF',
  border: '1px solid #FFFFFF',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1em',
  transition: 'background-color 0.3s, color 0.3s'
};

const hrStyle: CSSProperties = {
  border: 'none',
  height: '1px',
  backgroundColor: '#FFFFFF', // Alterado para verde como nos botões
  margin: '40px 0',
  boxShadow: '0 0 20px #4ECB71, 0 0 40px #FFFFFF' // Aumentado o glow forte nas linhas
};

const sectionStyle: CSSProperties = {
  backgroundColor: '#000000',
  color: '#FFFFFF',
  padding: '40px'
};

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginTop: '40px'
};

const socialLinkStyle: CSSProperties = {
  marginRight: '20px',
  color: '#FFFFFF',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center'
};

const socialIconStyle: CSSProperties = {
  width: '24px',
  height: '24px',
  marginRight: '5px'
};

const scrollButtonStyle: CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#4ECB71',
  color: '#FFFFFF',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 0.3s',
  boxShadow: '0 0 24px #4ECB71' // Adicionado glow nos botões verdes
};

const App = () => {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sobreNosRef = useRef<HTMLDivElement>(null);
  const paraEmpresasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prevRotation => (prevRotation + 1) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.scrollBehavior = 'smooth';
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSobreNos = () => {
    sobreNosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToParaEmpresas = () => {
    paraEmpresasRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }} // Começa invisível e acima
      animate={{ opacity: 1, y: 0 }} // Fica visível e na posição original
      transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }} // Duração da animação e configuração da animação
    >
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/central.svg" alt="Logo" style={logoStyle} />
          <span>Central da Resenha</span>
        </div>
        <nav>
          <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={navLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#4ECB71'} onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}>Home</a>
          <a href="#" onClick={scrollToParaEmpresas} style={navLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#4ECB71'} onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}>Para empresas</a>
          <a href="#" onClick={scrollToSobreNos} style={navLinkStyle} onMouseEnter={(e) => e.currentTarget.style.color = '#4ECB71'} onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}>Sobre nós</a>
        </nav>
      </header>
      <main style={mainContainerStyle}>
        <div style={{...contentContainerStyle, flexDirection: isMobile ? 'column' : 'row'}}>
          {isMobile && (
            <div style={logoContainerStyle}>
              <img 
                src="/central.svg" 
                alt="Logo Central da Resenha" 
                style={{
                  maxWidth: '100%', 
                  height: 'auto', 
                  marginBottom: '20px',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.1s linear'
                }} 
              />
            </div>
          )}
          <div style={textContainerStyle}>
            <h1 className="central-title">Central da Resenha</h1> {/* Alterado para usar a nova classe */}
            <p style={{marginBottom: '20px'}}>
              Revolucione sua experiência futebolística!
              Organize partidas, divida despesas e potencialize a diversão.
              Seu fut nunca mais será o mesmo!
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" style={buttonStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3BA55D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4ECB71'}>
                Agendar download
              </a>
              <button onClick={scrollToSobreNos} style={secondaryButtonStyle} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#000000';}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFFFFF';}}>
                Saiba mais
              </button>
            </div>
          </div>
          {!isMobile && (
            <div style={logoContainerStyle}>
              <img 
                src="/central.svg" 
                alt="Logo Central da Resenha" 
                style={{
                  maxWidth: '100%', 
                  height: 'auto', 
                  marginBottom: '20px',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.1s linear'
                }} 
              />
            </div>
          )}
        </div>
      </main>
      <hr style={hrStyle} />
      <section ref={paraEmpresasRef} style={sectionStyle}>
        <div style={{...contentContainerStyle, flexDirection: isMobile ? 'column' : 'row'}}>
          <div style={logoContainerStyle}>
            <img 
              src="/business.svg" 
              alt="Ícone de Empresa" 
              style={{
                maxWidth: '50%', 
                height: 'auto', 
                marginBottom: '20px'
              }} 
            />
          </div>
          <div style={textContainerStyle}>
            <h2 style={{fontSize: '2.8em', marginBottom: '20px'}} className='central-title'>Para empresas</h2>
            <h3 style={{fontSize: '1.5em', marginBottom: '20px'}}>Solução para a sua empresa</h3>
            <p style={{marginBottom: '20px'}}>
              Ofereça aos seus funcionários uma plataforma para organizar partidas de futebol e fortalecer o espírito de equipe. Aumente a produtividade e o bem-estar no ambiente de trabalho.
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <a href="#" style={buttonStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3BA55D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4ECB71'}>
                Criar sua empresa
              </a>
              <a href="/empresa" style={secondaryButtonStyle} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#000000';}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFFFFF';}}>
                Entrar
              </a>
            </div>
          </div>
        </div>
      </section>
      <hr style={hrStyle} />
      <section ref={sobreNosRef} style={sectionStyle}>
        <h2 style={{fontSize: '2em', marginBottom: '20px', textAlign: 'left'}} className='central-title'>Sobre Nós</h2>
        <p style={{marginBottom: '20px'}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.
        </p>
        <footer style={footerStyle}>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTkuMDUgNC45MUE5LjgyIDkuODIgMCAwIDAgMTIuMDQgMmMtNS40NiAwLTkuOTEgNC40NS05LjkxIDkuOTFjMCAxLjc1LjQ2IDMuNDUgMS4zMiA0Ljk1TDIuMDUgMjJsNS4yNS0xLjM4YzEuNDUuNzkgMy4wOCAxLjIxIDQuNzQgMS4yMWM1LjQ2IDAgOS45MS00LjQ1IDkuOTEtOS45MWMwLTIuNjUtMS4wMy01LjE0LTIuOS03LjAxbS03LjAxIDE1LjI0Yy0xLjQ4IDAtMi45My0uNC00LjItMS4xNWwtLjMtLjE4bC0zLjEyLjgybC44My0zLjA0bC0uMi0uMzFhOC4yNiA4LjI2IDAgMCAxLTEuMjYtNC4zOGMwLTQuNTQgMy43LTguMjQgOC4yNC04LjI0YzIuMiAwIDQuMjcuODYgNS44MiAyLjQyYTguMTggOC4xOCAwIDAgMSAyLjQxIDUuODNjLjAyIDQuNTQtMy42OCA4LjIzLTguMjIgOC4yM200LjUyLTYuMTZjLS4yNS0uMTItMS40Ny0uNzItMS42OS0uODFjLS4yMy0uMDgtLjM5LS4xMi0uNTYuMTJjLS4xNy4yNS0uNjQuODEtLjc4Ljk3Yy0uMTQuMTctLjI5LjE5LS41NC4wNmMtLjI1LS4xMi0xLjA1LS4zOS0xLjk5LTEuMjNjLS43NC0uNjYtMS4yMy0xLjQ3LTEuMzgtMS43MmMtLjE0LS4yNS0uMDItLjM4LjExLS41MWMuMTEtLjExLjI1LS4yOS4zNy0uNDNzLjE3LS4yNS4yNS0uNDFjLjA4LS4xNy4wNC0uMzEtLjAyLS40M3MtLjU2LTEuMzQtLjc2LTEuODRjLS4yLS40OC0uNDEtLjQyLS41Ni0uNDNoLS40OGMtLjE3IDAtLjQzLjA2LS42Ni4zMWMtLjIyLjI1LS44Ni44NS0uODYgMi4wN3MuODkgMi40IDEuMDEgMi41NmMuMTIuMTcgMS43NSAyLjY3IDQuMjMgMy43NGMuNTkuMjYgMS4wNS40MSAxLjQxLjUyYy41OS4xOSAxLjEzLjE2IDEuNTYuMWMuNDgtLjA3IDEuNDctLjYgMS42Ny0xLjE4Yy4yMS0uNTguMjEtMS4wNy4xNC0xLjE4cy0uMjItLjE2LS40Ny0uMjgiLz48L3N2Zz4=" alt="WhatsApp" style={socialIconStyle} />
            +55 11 99999-9999
          </a>
          <a href="https://www.instagram.com/usuario_generico" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNy44IDJoOC40QzE5LjQgMiAyMiA0LjYgMjIgNy44djguNGE1LjggNS44IDAgMCAxLTUuOCA1LjhINy44QzQuNiAyMiAyIDE5LjQgMiAxNi4yVjcuOEE1LjggNS44IDAgMCAxIDcuOCAybS0uMiAyQTMuNiAzLjYgMCAwIDAgNCA3LjZ2OC44QzQgMTguMzkgNS42MSAyMCA3LjYgMjBoOC44YTMuNiAzLjYgMCAwIDAgMy42LTMuNlY3LjZDMjAgNS42MSAxOC4zOSA0IDE2LjQgNHptOS42NSAxLjVhMS4yNSAxLjI1IDAgMCAxIDEuMjUgMS4yNUExLjI1IDEuMjUgMCAwIDEgMTcuMjUgOEExLjI1IDEuMjUgMCAwIDEgMTYgNi43NWExLjI1IDEuMjUgMCAwIDEgMS4yNS0xLjI1TTEyIDdhNSA1IDAgMCAxIDUgNWE1IDUgMCAwIDEtNSA1YTUgNSAwIDAgMS01LTVhNSA1IDAgMCAxIDUtNW0wIDJhMyAzIDAgMCAwLTMgM2EzIDMgMCAwIDAgMyAzYTMgMyAwIDAgMCAzLTNhMyAzIDAgMCAwLTMtMyIvPjwvc3ZnPg==" alt="Instagram" style={socialIconStyle} />
            @usuario_generico
          </a>
        </footer>
      </section>
      <button onClick={scrollToSobreNos} style={scrollButtonStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3BA55D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4ECB71'}>
        ↓
      </button>
    </motion.div>
  )
}

export default App
