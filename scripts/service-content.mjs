// Customer-facing content shared by service pages, cards and enquiry guidance.
export const serviceContent = {
  'container-fumigation': {
    summary: 'Fumigation of shipping containers carrying export cargo, at your factory, loading point or container yard.',
    audience: 'Exporters, manufacturers, freight forwarders and logistics teams moving containerised cargo.',
    tags: ['Shipping containers', 'Export cargo', 'Factory & container yards'],
    includes: ['Fumigation of shipping containers carrying cargo', 'On-site treatment at the agreed factory, loading point or container yard', 'Scheduling around your loading and dispatch requirements', 'Discussion of treatment records needed for your shipment'],
    prepare: 'Share the number and size of containers, cargo type, destination, loading location and dispatch date.',
    guidance: 'For a faster discussion, include your container count, cargo and dispatch date.',
    note: 'Treatment availability and timing depend on the cargo, site and shipment requirements. Confirm these with our team before scheduling.'
  },
  'pallet-treatment': {
    summary: 'Fumigation for wooden pallets, packing boxes and crates used to protect goods during storage and transport.',
    audience: 'Exporters, packing suppliers and manufacturers using wooden packaging for their goods.',
    tags: ['Wooden pallets', 'Packing boxes', 'Crates'],
    includes: ['Fumigation of wooden pallets and packing boxes', 'Treatment of wooden crates used for shipping goods', 'On-site preparation and arrangement of wooden packaging', 'Discussion of destination and treatment record requirements'],
    prepare: 'Share the quantity and dimensions of the pallets or boxes, treatment location, destination and dispatch date.',
    guidance: 'Include the quantity of pallets or boxes, their dimensions and your dispatch date.',
    note: 'Tell our team about any destination-specific packaging or documentation requirements before arranging treatment.'
  },
  'warehouse-fumigation': {
    summary: 'Fumigation of stored commodity stacks in warehouses and godowns, including grains, spices and other bagged goods.',
    audience: 'Commodity traders, exporters and warehouse operators managing stored goods.',
    tags: ['Commodity stacks', 'Warehouses', 'Godowns'],
    includes: ['Fumigation of bagged commodity stacks', 'Treatment for stored grains, spices and other commodities', 'Service at warehouses and godowns', 'Preparation and scheduling around stored goods and dispatch'],
    prepare: 'Share the commodity, approximate tonnage or stack count, godown location and your next dispatch date.',
    guidance: 'Include the commodity type, stack count or tonnage and godown location.',
    note: 'The treatment plan depends on the commodity and storage conditions. Ask our team about access and scheduling before moving goods.'
  },
  'termite-control': {
    summary: 'Anti-termite treatment for buildings under construction and existing properties with signs of termite activity.',
    audience: 'Homeowners, builders and facility teams protecting buildings, fixtures and woodwork.',
    tags: ['Before construction', 'Existing buildings', 'Homes & workplaces'],
    includes: ['Assessment of termite activity and affected areas', 'Anti-termite treatment for buildings under construction', 'Treatment for existing buildings with termite concerns', 'Aftercare and prevention guidance for your property'],
    prepare: 'Tell us whether the property is under construction or occupied, its approximate size and where you have noticed termite activity.',
    guidance: 'Include the property size and whether it is under construction or occupied.',
    note: 'Our team will discuss the treatment scope and any applicable service terms for your property.'
  },
  'ant-cockroach-treatment': {
    summary: 'Targeted ant and cockroach treatment for kitchens, homes, offices, canteens and other affected spaces.',
    audience: 'Homeowners, restaurants, office teams and commercial kitchens with ant or cockroach concerns.',
    tags: ['Ants & cockroaches', 'Kitchens', 'Homes & offices'],
    includes: ['Treatment targeting ants and cockroaches', 'Service for kitchens, rooms, canteens and workplaces', 'Preparation and aftercare advice for the treated areas', 'Guidance on cleaning, food storage and prevention'],
    prepare: 'Share the property type, approximate area and the rooms or workspaces where you notice ants or cockroaches.',
    guidance: 'Tell us the property type and where you are seeing ants or cockroaches.',
    note: 'Preparation and access requirements vary by treatment. Check the instructions for your premises with our team.'
  },
  'general-pest-control': {
    summary: 'Pest control for everyday insect concerns in homes, offices, factories and commercial premises.',
    audience: 'Households and businesses looking for pest treatment suited to their space.',
    tags: ['Homes', 'Commercial spaces', 'Factories'],
    includes: ['Treatment for common insect concerns', 'Pest control for homes, offices and commercial premises', 'Service for factories and workplaces', 'Discussion of one-time or recurring treatment needs'],
    prepare: 'Share your property type, approximate area, the pests you have noticed and whether you need a one-time visit or recurring service.',
    guidance: 'Describe the pest problem, property type and approximate area.',
    note: 'Not sure which treatment to choose? Describe the problem and our team will help you identify a suitable service.'
  },
  'rodent-control': {
    summary: 'Control of rats and mice in warehouses, factories, workplaces and properties, with advice on reducing entry points.',
    audience: 'Warehouse operators, facility managers and property owners noticing rats, mice or related damage.',
    tags: ['Rats & mice', 'Warehouses', 'Entry prevention'],
    includes: ['Control of rats and mice at your property', 'Rodent monitoring suited to the site', 'Advice on entry points and storage practices', 'Follow-up planning based on rodent activity'],
    prepare: 'Share the site type and size, goods stored and where you have noticed droppings, burrows or damage.',
    guidance: 'Include your site type and where you have noticed rodent activity or damage.',
    note: 'Rodent prevention also depends on housekeeping, storage and building access. Discuss these alongside the treatment.'
  },
  'prophylactic-treatment': {
    summary: 'Preventive pest treatment for empty godowns, warehouses and storage spaces before fresh goods arrive.',
    audience: 'Warehouse operators and commodity businesses preparing empty storage spaces for new stock.',
    tags: ['Preventive care', 'Empty storage', 'Before new stock'],
    includes: ['Preventive pest treatment of empty storage spaces', 'Service for godowns and warehouses before new stock arrives', 'Preparation and cleaning guidance before the visit', 'Treatment scheduling around the arrival of fresh goods'],
    prepare: 'Share the storage area, incoming commodity, location and the dates when the space will be empty.',
    guidance: 'Tell us the storage area and when it will be empty for treatment.',
    note: 'Arrange the visit before fresh stock arrives and confirm preparation and re-entry instructions with the team.'
  }
};

export const serviceVisuals = {
  'container-fumigation': { object: 'SHIPPING CONTAINERS', description: 'Treating shipping containers before cargo moves from your factory or container yard.', use: 'Exporters & logistics teams', hint: 'Shipping containers & export cargo', icon: 'container' },
  'pallet-treatment': { object: 'WOODEN PACKAGING', description: 'Treating wooden pallets, packing boxes and crates used to ship your goods.', use: 'Manufacturers & packing suppliers', hint: 'Wooden pallets, boxes & crates', icon: 'pallet' },
  'warehouse-fumigation': { object: 'STORED COMMODITIES', description: 'Treating stacks of grains, spices and other bagged goods inside godowns and warehouses.', use: 'Commodity traders & warehouses', hint: 'Grains, spices & bagged goods', icon: 'stack' },
  'termite-control': { object: 'TERMITES', description: 'Anti-termite treatment for buildings, foundations and affected woodwork.', use: 'New construction & existing properties', hint: 'Buildings & woodwork', icon: 'termite' },
  'ant-cockroach-treatment': { object: 'ANTS & COCKROACHES', description: 'Targeted treatment for ants and cockroaches in kitchens, rooms and workplaces.', use: 'Homes, kitchens & canteens', hint: 'Kitchens, rooms & canteens', icon: 'ant' },
  'general-pest-control': { object: 'EVERYDAY INSECT CONCERNS', description: 'Treatment for common insect problems across your home or business premises.', use: 'Homes, offices & factories', hint: 'Homes, offices & factories', icon: 'general' },
  'rodent-control': { object: 'RATS & MICE', description: 'Rodent control and monitoring, with advice on preventing entry into your property.', use: 'Warehouses, factories & properties', hint: 'Rats & mice', icon: 'rodent' },
  'prophylactic-treatment': { object: 'PREVENTIVE STORAGE CARE', description: 'Preventive pest treatment of empty godowns before fresh stock arrives.', use: 'Empty warehouses & godowns', hint: 'Empty storage, before new stock', icon: 'preventive' }
};
