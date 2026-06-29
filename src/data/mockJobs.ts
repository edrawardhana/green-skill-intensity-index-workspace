import { JobVacancy, OntologyTerm } from '../types';

export const INITIAL_ONTOLOGY: OntologyTerm[] = [
  // Direct Green Terms
  {
    term: 'sustainability',
    category: 'direct',
    description: 'Konsep pengelolaan sumber daya untuk masa depan tanpa merusak lingkungan.',
    synonyms: ['keberlanjutan', 'sustainable development', 'sustainability management']
  },
  {
    term: 'ESG',
    category: 'direct',
    description: 'Environmental, Social, and Governance - standar tata kelola ramah lingkungan.',
    synonyms: ['esg compliance', 'esg reporting', 'environmental social governance']
  },
  {
    term: 'renewable energy',
    category: 'direct',
    description: 'Energi terbarukan seperti tenaga surya, angin, biomassa, hidro.',
    synonyms: ['energi terbarukan', 'solar energy', 'wind power', 'biomass', 'solar PV']
  },
  {
    term: 'carbon accounting',
    category: 'direct',
    description: 'Perhitungan dan pelaporan emisi gas rumah kaca organisasi.',
    synonyms: ['audit karbon', 'carbon footprint', 'greenhouse gas', 'GHG accounting', 'jejak karbon']
  },
  {
    term: 'net zero',
    category: 'direct',
    description: 'Kondisi di mana jumlah emisi gas rumah kaca yang dihasilkan seimbang dengan yang diserap.',
    synonyms: ['net-zero carbon', 'carbon neutrality', 'emisi nol bersih', 'dekarbonisasi']
  },
  {
    term: 'circular economy',
    category: 'direct',
    description: 'Model ekonomi daur ulang untuk mengurangi limbah secara ekstrem.',
    synonyms: ['ekonomi sirkular', 'closed loop', 'cradle to cradle', 'waste-to-resource']
  },
  {
    term: 'green manufacturing',
    category: 'direct',
    description: 'Proses produksi manufaktur yang meminimalkan dampak lingkungan negatif.',
    synonyms: ['manufaktur hijau', 'eco-friendly production', 'clean production', 'green assembly']
  },

  // Indirect Green Terms
  {
    term: 'energy efficiency',
    category: 'indirect',
    description: 'Pengurangan konsumsi energi tanpa mengurangi output operasional.',
    synonyms: ['efisiensi energi', 'energy saving', 'power optimization', 'energy conservation']
  },
  {
    term: 'waste reduction',
    category: 'indirect',
    description: 'Upaya meminimalkan volume sampah atau limbah operasional perusahaan.',
    synonyms: ['pengurangan limbah', 'waste minimization', 'zero waste', 'limbah nihil']
  },
  {
    term: 'environmental compliance',
    category: 'indirect',
    description: 'Kepatuhan terhadap hukum, regulasi, dan standar lingkungan pemerintah.',
    synonyms: ['kepatuhan lingkungan', 'AMDAL', 'UKL-UPL', 'PROPER', 'regulasi lingkungan']
  },
  {
    term: 'ISO 14001',
    category: 'indirect',
    description: 'Standar internasional untuk Sistem Manajemen Lingkungan (SML).',
    synonyms: ['iso14001', 'sistem manajemen lingkungan', 'environmental management system', 'EMS']
  },
  {
    term: 'sustainable sourcing',
    category: 'indirect',
    description: 'Pengadaan bahan baku ramah lingkungan yang bersertifikasi sosial/ekologis.',
    synonyms: ['green procurement', 'sustainable supply chain', 'pembelian ramah lingkungan']
  },
  {
    term: 'eco-design',
    category: 'indirect',
    description: 'Perancangan produk dengan mempertimbangkan siklus hidup dan dampak ekologis.',
    synonyms: ['desain ekologis', 'design for environment', 'green product design']
  },

  // Transition Skills
  {
    term: 'smart manufacturing',
    category: 'transition',
    description: 'Penerapan IoT dan otomatisasi untuk mengefisienkan proses industri/manufaktur.',
    synonyms: ['manufaktur cerdas', 'industry 4.0', 'factory automation', 'cyber-physical systems']
  },
  {
    term: 'IoT energy monitoring',
    category: 'transition',
    description: 'Penggunaan sensor IoT untuk melacak konsumsi daya dan utilitas secara real-time.',
    synonyms: ['monitoring energi pintar', 'smart grid', 'sub-metering', 'IoT power analytics']
  },
  {
    term: 'environmental analytics',
    category: 'transition',
    description: 'Analisis data sensor lingkungan (emisi, kualitas udara, pembuangan air).',
    synonyms: ['analisis lingkungan', 'environmental data science', 'pollution telemetry']
  },
  {
    term: 'sustainable supply chain',
    category: 'transition',
    description: 'Transformasi rantai pasok konvensional ke rute rendah emisi dan logistik ramah lingkungan.',
    synonyms: ['logistik hijau', 'green logistics', 'sustainable logistics', 'emission-tracked transport']
  }
];

export const MOCK_RAW_JOBS: JobVacancy[] = [
  {
    job_id: 'JS-001',
    source: 'JobStreet',
    job_title: 'ESG and Sustainability Analyst',
    company: 'PT Maspion Industrial Group',
    industry: 'Manufacturing',
    location: 'Sidoarjo, Jawa Timur',
    salary_min: 12000000,
    salary_max: 18000000,
    posting_date: '2026-05-15T09:00:00Z',
    job_description: 'We are seeking an ESG and Sustainability Analyst to lead our sustainability reporting and ESG performance tracking. You will be responsible for calculating greenhouse gas (GHG) emission baselines, coordinating carbon accounting initiatives across 3 manufacturing units in Sidoarjo, and preparing disclosures aligned with GRI and ISSB frameworks. You will design action plans for net zero transition and support our circular economy programs through active waste reduction. Collaborate with production heads to execute green manufacturing protocols.',
    qualifications: 'Bachelor degree in Environmental Engineering, Sustainability, or chemical science. Minimum 3 years of experience in ESG Reporting and carbon accounting. Familiar with ISO 14001 standards.',
    employment_type: 'Full-time',
    experience: 3,
    education: 'Bachelor Degree',
    url: 'https://www.jobstreet.co.id/en/job/esg-sustainability-analyst-js001'
  },
  {
    job_id: 'JS-002',
    source: 'JobStreet',
    job_title: 'Solar PV Site Engineer',
    company: 'PT Surya Renewable Energy Nusantara',
    industry: 'Renewable Energy',
    location: 'Gresik, Jawa Timur',
    salary_min: 8500000,
    salary_max: 13000000,
    posting_date: '2026-06-10T14:30:00Z',
    job_description: 'Responsible for leading the installation, testing, and commissioning of utility-scale solar PV roofing systems in Gresik industrial estates. Work closely with grid integration engineers to install smart grids and renewable energy storage solutions. Perform energy efficiency audits, calculate carbon reduction metrics for client factories, and ensure absolute environmental compliance with local regulations. Manage sub-contractors on-site and report on environmental impact management plans (UKL-UPL).',
    qualifications: 'Bachelor degree in Electrical Engineering or Renewable Energy Engineering. 2+ years of experience in Solar PV design and field installation. Having certification as an Energy Auditor is a huge plus.',
    employment_type: 'Full-time',
    experience: 2,
    education: 'Bachelor Degree',
    url: 'https://www.jobstreet.co.id/en/job/solar-pv-site-engineer-js002'
  },
  {
    job_id: 'GL-001',
    source: 'Glints',
    job_title: 'Environmental and Waste Management Coordinator',
    company: 'PT Petrokimia Gresik Group',
    industry: 'Chemical Industry',
    location: 'Gresik, Jawa Timur',
    salary_min: 14000000,
    salary_max: 22000000,
    posting_date: '2026-04-20T08:00:00Z',
    job_description: 'Directing the plant-wide environmental compliance system and waste management programs. Supervise toxic and hazardous waste (B3) containment and wastewater treatment processing. Lead audits for ISO 14001 Environmental Management Systems and achieve PROPER Hijau rating targets. Implement circular economy initiatives to convert manufacturing process by-products into high-value agricultural soil nutrients. Direct energy efficiency assessments and waste reduction campaigns in partnership with chemical process optimization groups.',
    qualifications: 'Master or Bachelor degree in Chemical Engineering / Environmental Science. 5+ years of chemical factory experience focusing on environmental compliance, toxic waste treatment, and ISO 14001 certification audits.',
    employment_type: 'Full-time',
    experience: 5,
    education: 'Bachelor or Master Degree',
    url: 'https://glints.com/id/en/opportunities/jobs/waste-management-coordinator-gl001'
  },
  {
    job_id: 'GL-002',
    source: 'Glints',
    job_title: 'Smart Factory IoT & Energy Systems Lead',
    company: 'PT Unilever Indonesia Tbk',
    industry: 'Smart Manufacturing',
    location: 'Rungkut, Surabaya',
    salary_min: 18000000,
    salary_max: 28000000,
    posting_date: '2026-06-01T10:15:00Z',
    job_description: 'We are driving the digital and green twin-transition in our Rungkut factory. We need a lead engineer to architect our IoT energy monitoring systems across assembly lines. Integrate smart energy meters, gas flow sensors, and telemetry into our centralised Factory 4.0 dashboard. Deploy environmental analytics algorithms to predict power demand spikes and automatically trigger energy efficiency load-shedding. Drive sustainability initiatives by optimizing HVAC systems and coordinating waste reduction analytics.',
    qualifications: 'Degree in Computer Science, Electrical Engineering, or Mechatronics. Expert in IoT protocol design, SCADA integration, and Python/R analytics. 4+ years of industrial automation or smart factory experience.',
    employment_type: 'Full-time',
    experience: 4,
    education: 'Bachelor Degree',
    url: 'https://glints.com/id/en/opportunities/jobs/smart-factory-iot-lead-gl002'
  },
  {
    job_id: 'LI-001',
    source: 'LinkedIn',
    job_title: 'Head of Global Sustainable Sourcing',
    company: 'PT Charoen Pokphand Indonesia',
    industry: 'Agriculture',
    location: 'Surabaya, Jawa Timur',
    salary_min: 25000000,
    salary_max: 40000000,
    posting_date: '2026-05-28T07:00:00Z',
    job_description: 'Oversee regional raw materials acquisition with a strict mandate for sustainable sourcing and carbon reduction. Audit supply chains for ecological impact, deforestation risks, and ethical treatment. Work with local farmers in East Java to introduce regenerative agriculture methods, carbon accounting standards, and water-saving tech. Align corporate procurement policies with net zero requirements. Lead cross-functional sustainability initiatives, managing environmental compliance across logistics, processing plants, and consumer-ready storage.',
    qualifications: '10+ years in international supply chain and agricultural logistics. Master degree in Sustainable Business, Agronomy, or Business Operations. Proven success implementing green procurement frameworks.',
    employment_type: 'Full-time',
    experience: 10,
    education: 'Master Degree',
    url: 'https://www.linkedin.com/jobs/view/head-sustainable-sourcing-li001'
  },
  {
    job_id: 'JS-003',
    source: 'JobStreet',
    job_title: 'Energy Efficiency Mechanical Specialist',
    company: 'PT Semen Indonesia Tbk',
    industry: 'Manufacturing',
    location: 'Tuban, Jawa Timur',
    salary_min: 15000000,
    salary_max: 22000000,
    posting_date: '2026-06-18T11:45:00Z',
    job_description: 'Execute thermal energy efficiency optimizations for our Tuban cement rotary kilns and waste heat recovery power generation systems. Monitor process emissions telemetry and configure pollution scrubbing parameters to maintain absolute environmental compliance. Drive factory-wide carbon reduction targets through fuel substitution (converting municipal RDF waste to thermal kiln fuel). Participate in waste reduction audits and champion green manufacturing methodologies across production teams.',
    qualifications: 'Bachelor in Mechanical Engineering. Certified Energy Auditor (KEA) by ESDM is highly preferred. 5 years in heavy manufacturing or thermal power plant operation with deep exposure to energy-saving calculations.',
    employment_type: 'Full-time',
    experience: 5,
    education: 'Bachelor Degree',
    url: 'https://www.jobstreet.co.id/en/job/energy-efficiency-specialist-js003'
  },
  {
    job_id: 'GL-003',
    source: 'Glints',
    job_title: 'Sustainable Supply Chain Consultant',
    company: 'PT Eco-Logistics Consult Indonesia',
    industry: 'Logistics',
    location: 'Surabaya, Jawa Timur',
    salary_min: 9000000,
    salary_max: 14000000,
    posting_date: '2026-06-22T13:00:00Z',
    job_description: 'As a consultant, you will analyze client shipping data to model sustainable supply chain transformations. Help clients calculate scope 3 emissions, establish eco-routing optimization, and transition vehicle fleets to biofuel or electric power. Conduct waste reduction audits at distribution centers in Gresik and Sidoarjo, introducing circular economy packaging systems. Author reports summarizing ESG metrics and environmental compliance improvements.',
    qualifications: 'Industrial Engineering or Supply Chain Management degree. 2-4 years in logistics planning, fleet routing, or environmental consultancy. Proficient in carbon calculator toolkits.',
    employment_type: 'Full-time',
    experience: 2,
    education: 'Bachelor Degree',
    url: 'https://glints.com/id/en/opportunities/jobs/sustainable-supply-chain-consultant-gl003'
  },
  {
    job_id: 'JS-004',
    source: 'JobStreet',
    job_title: 'Junior Environmental Officer',
    company: 'PT Woodone Indah Industri',
    industry: 'Manufacturing',
    location: 'Mojokerto, Jawa Timur',
    salary_min: 5500000,
    salary_max: 7500000,
    posting_date: '2026-06-25T16:00:00Z',
    job_description: 'Assist the Senior Environmental Officer in preparing daily AMDAL and UKL-UPL documentation. Collect water and noise samples to ensure environmental compliance of the timber treatment facility. Support the implementation of ISO 14001 Environmental Management Systems. Coordinate local waste reduction schedules and lumber off-cut recycling programs (circular economy). Track general electricity usage to identify simple energy efficiency measures on the shop floor.',
    qualifications: 'Diploma or Bachelor degree in Environmental Science / Forestry / Chemical Safety. Fresh graduates or 1 year of industrial experience are welcome. Enthusiastic about industrial sustainability.',
    employment_type: 'Full-time',
    experience: 1,
    education: 'Bachelor Degree',
    url: 'https://www.jobstreet.co.id/en/job/junior-environmental-officer-js004'
  },
  // Non-Green / Standard Jobs to demonstrate varying levels of intensity index
  {
    job_id: 'JS-005',
    source: 'JobStreet',
    job_title: 'Senior Digital Marketing Specialist',
    company: 'PT Sinar Jaya Retailindo',
    industry: 'Retail',
    location: 'Surabaya, Jawa Timur',
    salary_min: 8000000,
    salary_max: 12000000,
    posting_date: '2026-06-20T10:00:00Z',
    job_description: 'We are looking for an experienced Senior Digital Marketing Specialist to lead our brand growth campaigns in East Java. You will be responsible for managing paid ad channels (Google Ads, Facebook Ads, TikTok), creating SEO-optimized content, and orchestrating email marketing sequences. Analyze conversion funnels, execute A/B tests, and compile weekly digital analytics reports. Collaborate with creative designers to produce high-performing graphic assets.',
    qualifications: '4+ years in digital marketing, agency or fast-moving consumer retail brand. Proven track record of managing marketing budgets and hitting target ROAS.',
    employment_type: 'Full-time',
    experience: 4,
    education: 'Bachelor Degree',
    url: 'https://www.jobstreet.co.id/en/job/senior-digital-marketing-specialist-js005'
  },
  {
    job_id: 'GL-004',
    source: 'Glints',
    job_title: 'Human Resources & General Administrator',
    company: 'PT Gresik Marine Shipyard',
    industry: 'Automotive',
    location: 'Gresik, Jawa Timur',
    salary_min: 6000000,
    salary_max: 8500000,
    posting_date: '2026-06-12T09:30:00Z',
    job_description: 'Handle end-to-end recruitment pipelines for shipyard skilled workers and administrative office personnel in Gresik. Maintain employee attendance records, process payroll variables, manage office supply inventory, and coordinate facility general administrative maintenance. Coordinate worker training registrations and organize shipyard welfare gatherings. Assist in basic occupational safety administration reporting.',
    qualifications: 'Degree in Psychology, Management, or Social Sciences. 2 years of experience handling generalist HR or industrial office administration.',
    employment_type: 'Full-time',
    experience: 2,
    education: 'Bachelor Degree',
    url: 'https://glints.com/id/en/opportunities/jobs/hr-general-admin-gl004'
  },
  {
    job_id: 'LI-002',
    source: 'LinkedIn',
    job_title: 'Lead Software Engineer (React & Go)',
    company: 'PT FinTech Maju Bersama',
    industry: 'Finance',
    location: 'Surabaya, Jawa Timur',
    salary_min: 22000000,
    salary_max: 35000000,
    posting_date: '2026-06-26T08:00:00Z',
    job_description: 'Architecting high-throughput, low-latency microservices for our core digital wallet platform. Write clean, modular React frontend interfaces and implement highly efficient backend microservices in Go. Mentor junior developers, direct strict code review processes, and deploy services on Kubernetes clusters. Design database schemas for PostgreSQL and ensure security configurations align with banking certifications.',
    qualifications: '6+ years of full-stack software development experience. High proficiency in Go, React, and cloud native system design.',
    employment_type: 'Full-time',
    experience: 6,
    education: 'Bachelor Degree',
    url: 'https://www.linkedin.com/jobs/view/lead-software-engineer-li002'
  },
  {
    job_id: 'JS-006',
    source: 'JobStreet',
    job_title: 'Industrial Safety (K3) and Security Inspector',
    company: 'PT Baja Mulia Agung',
    industry: 'Manufacturing',
    location: 'Pasuruan, Jawa Timur',
    salary_min: 7000000,
    salary_max: 9500000,
    posting_date: '2026-06-14T11:00:00Z',
    job_description: 'Conducting safety risk assessments on heavy steel manufacturing shop floors. Draft worker incident reports, lead daily safety toolbox meetings, and enforce personal protective equipment (PPE) requirements. Perform basic inspections of fire extinguishers, alarms, and factory emergency exits. Coordinate security guard patrols and oversee visitor access log control. Cooperate with environmental compliance officers during joint safety audits.',
    qualifications: 'Certified Ahli K3 Umum (AK3U) is mandatory. At least 3 years of work experience in factory occupational safety or industrial security roles.',
    employment_type: 'Full-time',
    experience: 3,
    education: 'Diploma or Bachelor Degree',
    url: 'https://www.jobstreet.co.id/en/job/k3-safety-inspector-js006'
  },
  // Dupes and bad records for the Data Cleaning phase
  {
    job_id: 'JS-001-DUPE', // Duplicate of JS-001
    source: 'JobStreet',
    job_title: 'ESG and Sustainability Analyst',
    company: 'PT Maspion Industrial Group',
    industry: 'Manufacturing',
    location: 'Sidoarjo, Jawa Timur',
    salary_min: 12000000,
    salary_max: 18000000,
    posting_date: '2026-05-15T09:00:00Z',
    job_description: 'We are seeking an ESG and Sustainability Analyst to lead our sustainability reporting and ESG performance tracking. You will be responsible for calculating greenhouse gas (GHG) emission baselines, coordinating carbon accounting initiatives across 3 manufacturing units in Sidoarjo, and preparing disclosures aligned with GRI and ISSB frameworks. You will design action plans for net zero transition and support our circular economy programs through active waste reduction. Collaborate with production heads to execute green manufacturing protocols.',
    qualifications: 'Bachelor degree in Environmental Engineering, Sustainability, or chemical science. Minimum 3 years of experience in ESG Reporting and carbon accounting. Familiar with ISO 14001 standards.',
    employment_type: 'Full-time',
    experience: 3,
    education: 'Bachelor Degree',
    url: 'https://www.jobstreet.co.id/en/job/esg-sustainability-analyst-js001'
  },
  {
    job_id: 'JS-EMPTY', // Empty description
    source: 'JobStreet',
    job_title: 'Sustainability Intern',
    company: 'PT Green Earth Solutions',
    industry: 'ESG / Sustainability Consulting',
    location: 'Surabaya, Jawa Timur',
    salary_min: 2500000,
    salary_max: 3500000,
    posting_date: '2026-06-27T10:00:00Z',
    job_description: '', // Empty on purpose to test removal
    qualifications: 'Willing to learn',
    employment_type: 'Intern',
    experience: 0,
    education: 'Undergraduate',
    url: 'https://www.jobstreet.co.id/en/job/sustainability-intern-empty'
  }
];
