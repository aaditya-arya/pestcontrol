import { serviceContent } from './service-content.mjs';

const names = {
  'container-fumigation': 'Container Fumigation',
  'pallet-treatment': 'Pallet / Box Fumigation',
  'warehouse-fumigation': 'Stack Fumigation',
  'termite-control': 'Anti-Termite Treatment',
  'ant-cockroach-treatment': 'Ant / Cockroach Treatment',
  'general-pest-control': 'General Pest Control Work',
  'rodent-control': 'Rodent Control Treatment',
  'prophylactic-treatment': 'Prophylactic Treatment'
};
export const specsData = Object.fromEntries(Object.entries(serviceContent).map(([slug, copy]) => [slug, {
  slug, title: names[slug], badge: 'Service scope & planning', overview: copy.summary,
  parameters: [
    { label: 'Suited to', value: copy.audience },
    { label: 'Service covers', value: copy.includes.join('. ') + '.' },
    { label: 'Details to share', value: copy.prepare },
    { label: 'Before scheduling', value: copy.note },
    { label: 'Service areas', value: 'Ahmedabad, Mundra, Morbi and Unjha. Confirm availability for your site with our team.' }
  ],
  actionHref: `book-inspection.html?service=${slug}`, actionText: 'Enquire about this service',
  guidance: copy.guidance
}]));
