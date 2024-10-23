import Form from '@/app/ui/policies/edit-form';
import Breadcrumbs from '@/app/ui/policies/breadcrumbs';
import { fetchPolicyById } from '@/app/lib/data';
 
export default async function Page({params}: { params: {id: number } }) {
    const id = params.id;
    const policy = await fetchPolicyById(id);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Policies', href: '/dashboard/policies' },
          {
            label: 'Edit Policy',
            href: `/dashboard/policies/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form policy={policy} />
    </main>
  );
}