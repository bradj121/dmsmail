import Form from '@/app/ui/policies/create-form';
import Breadcrumbs from '@/app/ui/policies/breadcrumbs';
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Policies', href: '/dashboard/policies' },
          {
            label: 'Create Policy',
            href: '/dashboard/policies/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}