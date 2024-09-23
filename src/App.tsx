import { useState, useEffect, useRef, CSSProperties } from 'react';

const headerStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 40px',
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
  transition: 'background-color 0.3s'
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
  backgroundColor: '#FFFFFF',
  margin: '40px 0'
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
  transition: 'background-color 0.3s'
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
    <>
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
    <div style={mainContainerStyle}>
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
          <h1 style={{fontSize: '2.5em', marginBottom: '20px'}}>Central da Resenha</h1>
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
    </div>
    <hr style={hrStyle} />
    <div ref={paraEmpresasRef} style={sectionStyle}>
      <div style={{...contentContainerStyle, flexDirection: isMobile ? 'column' : 'row'}}>
        <div style={logoContainerStyle}>
          <img 
            src="/empresa-icon.svg" 
            alt="Ícone de Empresa" 
            style={{
              maxWidth: '100%', 
              height: 'auto', 
              marginBottom: '20px'
            }} 
          />
        </div>
        <div style={textContainerStyle}>
          <h2 style={{fontSize: '2em', marginBottom: '20px'}}>Para empresas</h2>
          <h3 style={{fontSize: '1.5em', marginBottom: '20px'}}>Solução para a sua empresa</h3>
          <p style={{marginBottom: '20px'}}>
            Ofereça aos seus funcionários uma plataforma para organizar partidas de futebol e fortalecer o espírito de equipe. Aumente a produtividade e o bem-estar no ambiente de trabalho.
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href="#" style={buttonStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3BA55D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4ECB71'}>
              Criar sua empresa
            </a>
            <button style={secondaryButtonStyle} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#000000';}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFFFFF';}}>
              Saiba mais
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr style={hrStyle} />
    <div ref={sobreNosRef} style={sectionStyle}>
      <h2 style={{fontSize: '2em', marginBottom: '20px'}}>Sobre Nós</h2>
      <p style={{marginBottom: '20px'}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.
      </p>
      <footer style={footerStyle}>
        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
          <img src="/whatsapp-icon.svg" alt="WhatsApp" style={socialIconStyle} />
          +55 11 99999-9999
        </a>
        <a href="https://www.instagram.com/usuario_generico" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
          <img src="/instagram-icon.svg" alt="Instagram" style={socialIconStyle} />
          @usuario_generico
        </a>
      </footer>
    </div>
    <button onClick={scrollToSobreNos} style={scrollButtonStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3BA55D'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4ECB71'}>
      ↓
    </button>
    </>
  )
}

export default App
