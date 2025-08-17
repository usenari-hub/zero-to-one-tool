import React from "react";

export type ChainLink = {
  avatar: string; // e.g., emoji/initials
  anonymousName: string;
  potentialBacon: number; // dollars
};

export type Chain = {
  code: string;
  activeTime: string; // e.g., "2h 15m"
  links: ChainLink[];
  nextBaconAmount: number; // dollars
};

export type RealtimeChainVizProps = {
  chains: Chain[];
  stats?: {
    activeChains?: number;
    totalBaconPool?: number;
    studentsInterested?: number;
  };
  className?: string;
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const RealtimeChainViz: React.FC<RealtimeChainVizProps> = ({ chains = [], stats, className }) => {
  const activeChains = stats?.activeChains ?? chains.length;
  const totalBaconPool = stats?.totalBaconPool ?? Math.round(chains.reduce((s, c) => s + (c.nextBaconAmount || 0), 0));
  const studentsInterested = stats?.studentsInterested ?? chains.reduce((s, c) => s + c.links.length, 0);

  return (
    <section className={className} aria-label="Live Referral Chain Activity">
      <div className="live-chain-activity">
        <h3>🔗 Live Referral Chain Activity</h3>

        <div className="chain-visualizer">
          <div className="active-chains" id="activeChains">
            {chains.map((chain) => (
              <div className="chain-display" key={chain.code}>
                <div className="chain-nodes">
                  {chain.links.map((link, index) => (
                    <React.Fragment key={`${chain.code}-${index}`}>
                      <div className={`chain-node degree-${index + 1}`}>
                        <div className="node-avatar">{link.avatar}</div>
                        <div className="node-info">
                          <div className="node-name">{link.anonymousName}</div>
                          <div className="node-bacon">{formatMoney(link.potentialBacon)} pending</div>
                        </div>
                      </div>
                      {index < chain.links.length - 1 && <div className="chain-connector">→</div>}
                    </React.Fragment>
                  ))}

                  {chain.links.length < 6 && (
                    <>
                      <div className="chain-connector">→</div>
                      <div className="chain-node potential">
                        <div className="node-avatar">❓</div>
                        <div className="node-info">
                          <div className="node-name">Next Student</div>
                          <div className="node-bacon">{formatMoney(chain.nextBaconAmount)} available</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="chain-metadata">
                  <span className="chain-id">Chain: {chain.code}</span>
                  <span className="chain-activity">Active for {chain.activeTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chain-stats">
          <div className="stat-item">
            <span className="stat-number">{activeChains}</span>
            <span className="stat-label">Active Chains</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{formatMoney(totalBaconPool)}</span>
            <span className="stat-label">Total Bacon Pool</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{studentsInterested}</span>
            <span className="stat-label">Students Interested</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealtimeChainViz;
