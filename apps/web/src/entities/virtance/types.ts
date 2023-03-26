export type Virtance = {
  id: number;
  name: string;
  vcpu: number;
  memory: number;
  disk: number;
  locked: boolean;
  status: 'active' | 'pending';
  created_at: string;
  features: [];
  backup_ids: [];
  snapshot_ids: [];
  image: {
    slug: string;
    name: string;
    distribution: string;
    regions: string[];
    public: boolean;
    created_at: string;
    type: 'distribution';
    description: string;
    min_disk_size: number;
    size_gigabytes: number;
    status: 'available';
  };
  size: {
    slug: string;
    memory: number;
    vcpu: number;
    disk: number;
    transfer: number;
    description: 'Micro';
    available: boolean;
    price_hourly: string;
    price_monthly: number;
    regions: string[];
  };
  networks: {
    v4: [
      {
        address: string;
        netmask: string;
        gateway: string;
        type: 'private';
      },
      {
        address: string;
        netmask: string;
        gateway: string;
        type: 'public';
      },
      {
        address: string;
        netmask: string;
        gateway: string;
        type: 'compute';
      },
    ];
  };
  region: {
    slug: string;
    name: string;
    available: boolean;
    features: [];
    sizes: string[];
  };
};
