import { IoClose, IoHome, IoPeople } from 'react-icons/io5';

export default function Sidebar({ setShowSidebar }) {
  const menuItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: IoHome,
    },
    { 
      href: "/employees", 
      label: "Employees", 
      icon: IoPeople,
    }
  ];

  return (
    <div style={{
      width: '256px',
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IoPeople size={18} color="white" />
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>Staffy</h2>
        </div>
        <button 
          onClick={() => setShowSidebar(false)}
          style={{
            padding: '0.5rem',
            color: '#dc2626',
            borderRadius: '9999px',
            transition: 'all 0.2s'
          }}
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#9ca3af',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Main Menu
          </h3>
        </div>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <a 
                  href={item.href} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    color: '#374151',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    background: index === 0 ? 'linear-gradient(to right, #3b82f6, #2563eb)' : 'linear-gradient(to right, #10b981, #059669)',
                    marginRight: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={18} color="white" />
                  </div>
                  <span style={{ fontWeight: '500' }}>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}