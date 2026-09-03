import { useGameStore } from '../../store/useGameStore.js';
import { getNode } from '../../data/chapters/index.js';
import { SHOP_INVENTORIES } from '../../data/items.js';
import ImagePanel from '../ui/ImagePanel.jsx';

export default function ShopScreen() {
  const { currentNodeId, gold, inventory, equipment, buyItem, equipItem, goToNode } = useGameStore();
  const node = getNode(currentNodeId);
  if (!node) return null;

  const shopItems = SHOP_INVENTORIES[node.shopId] ?? [];

  function getQty(itemId) {
    return inventory.find(i => i.id === itemId)?.qty ?? 0;
  }

  function isEquipped(item) {
    if (!item.slot) return false;
    return equipment[item.slot]?.id === item.id;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ImagePanel src={node.image} alt={node.title} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#ffd54f', fontSize: 16, margin: 0 }}>🏪 {node.title}</h2>
        <span style={{ color: '#ffd54f', fontWeight: 700 }}>💰 {gold}G</span>
      </div>

      {node.text && (
        <p style={{ color: '#aaa', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{node.text}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shopItems.map(item => {
          const owned = getQty(item.id);
          const equipped = isEquipped(item);
          const canAfford = gold >= item.price;
          return (
            <div
              key={item.id}
              style={{
                background: '#0d0d1a', border: `1px solid ${equipped ? '#ffd54f' : '#2a2a3e'}`,
                borderRadius: 8, padding: '12px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: equipped ? '#ffd54f' : '#ddd', fontSize: 13 }}>
                  {item.name} {equipped && '(장착 중)'}
                </div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{item.desc}</div>
                {owned > 0 && (
                  <div style={{ fontSize: 11, color: '#4fc3f7', marginTop: 2 }}>보유 {owned}개</div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                <span style={{ color: canAfford ? '#ffd54f' : '#555', fontWeight: 700, fontSize: 13 }}>
                  {item.price}G
                </span>
                <button
                  onClick={() => buyItem(item)}
                  disabled={!canAfford}
                  style={{
                    background: canAfford ? '#1a3a1a' : '#111',
                    border: `1px solid ${canAfford ? '#4caf50' : '#333'}`,
                    borderRadius: 4, padding: '4px 10px',
                    color: canAfford ? '#4caf50' : '#444', fontSize: 11,
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                  }}
                >
                  구매
                </button>
                {item.slot && owned > 0 && !equipped && (
                  <button
                    onClick={() => equipItem(item)}
                    style={{
                      background: '#1a2a3a', border: '1px solid #4fc3f7',
                      borderRadius: 4, padding: '4px 10px',
                      color: '#4fc3f7', fontSize: 11, cursor: 'pointer',
                    }}
                  >
                    장착
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => goToNode(node.next)}
        style={{
          background: 'linear-gradient(135deg, #1a3a1a, #4caf50)',
          border: 'none', borderRadius: 8, padding: '14px',
          color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
        }}
      >
        떠나기
      </button>
    </div>
  );
}
