interface Policy {
    id?: number;
    sender_id?: string;
    recipients?: string;
    subject?: string;
    body: string;
    expiration_date?: number;
    is_active: boolean;
  }
  
  export default Policy;