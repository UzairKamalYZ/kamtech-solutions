export type Project = {
  slug: string;
  name: string;
  client: string;
  period: string;
  status: "current" | "previous";
  summary: string;
  highlights: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "isabel-6",
    name: "Isabel 6",
    client: "Isabel — Brussels",
    period: "2017 — 2026",
    status: "previous",
    summary:
      "A multibanking platform giving organizations a single interface to manage banking across many banks — payments, direct debits, signatures, status tracking and account information.",
    highlights: [
      "Refactored core components to lift code quality and stability",
      "Delivered features across a large-scale, high-trust customer base",
      "Hardened CI/CD pipelines and incident response",
    ],
    stack: ["Java", "Spring", "ReactJS", "extJS", "Kubernetes", "OpenShift", "Oracle"],
  },
  {
    slug: "isabel-connect",
    name: "Isabel Connect",
    client: "Isabel — Brussels",
    period: "2017 — 2026",
    status: "previous",
    summary:
      "API-based multibanking built on top of Isabel 6, embedding payments and account information directly into ERPs, accounting and treasury systems.",
    highlights: [
      "Designed RESTful banking APIs with OAuth/Keycloak security",
      "Enabled automated payment initiation and reporting for enterprise clients",
    ],
    stack: ["Java", "Spring Security", "Swagger", "Keycloak", "Vault", "Docker"],
  },
  {
    slug: "confidential-dgeac",
    name: "Confidential",
    client: "DGEAC — European Commission",
    period: "2026 — Present",
    status: "current",
    summary:
      "An ongoing engagement with the European Commission's Directorate-General for Education, Youth, Sport and Culture. Project details are confidential.",
    highlights: [
      "Software engineering services for DGEAC",
      "Project details under NDA — available on request",
    ],
    stack: ["Confidential"],
  },
  {
    slug: "cctool",
    name: "CCTool",
    client: "Isabel — Brussels",
    period: "2017 — 2026",
    status: "previous",
    summary:
      "Internal customer-support tool used to triage user queries and incidents across the Isabel product suite.",
    highlights: [
      "Streamlined incident resolution workflows for support agents",
      "Integrated with core platform data and identity",
    ],
    stack: ["Java", "Spring", "ReactJS", "RESTful APIs"],
  },
  {
    slug: "sentiance",
    name: "Sentiance",
    client: "Xorlogics (Sentiance.com)",
    period: "2016 — 2017",
    status: "previous",
    summary:
      "Context-driven AI/ML platform analyzing user behavior and mobility to power personalization, risk and engagement use cases for insurers and enterprises.",
    highlights: [
      "Built Speed Layer for high-volume behavioral data processing",
      "Managed AWS environments, deployments and release pipelines",
    ],
    stack: ["Java", "Python", "Kafka", "Spark", "Hadoop", "Storm", "AWS", "Docker"],
  },
  {
    slug: "ansell-smartsheet",
    name: "Ansell Task Manager",
    client: "Xorlogics (Ansell Healthcare)",
    period: "2017",
    status: "previous",
    summary:
      "SmartSheet-integrated task management for Ansell's management team — create, update and complete tasks with org-wide sync.",
    highlights: [
      "Built from scratch and deployed on Azure",
      "Iterated directly with the management team on requirements",
    ],
    stack: ["Java", "Angular", "Azure", "SmartSheet API"],
  },
  {
    slug: "intuira",
    name: "IntuiRA",
    client: "Interactive Group",
    period: "2013 — 2016",
    status: "previous",
    summary:
      "Intelligent Unified Information Retrieval Agent — an AI-powered platform unifying websites, PDFs, documents and databases into a single searchable, graph-aware knowledge layer.",
    highlights: [
      "Phonetic, wildcard and similarity search across unstructured data",
      "Entity extraction, relationship discovery and sentiment analysis",
      "Applied across HR (resume intelligence) and healthcare ontologies",
    ],
    stack: ["Java", "Spring", "Solr", "Elasticsearch", "NLP", "ML", "R"],
  },
  {
    slug: "sanmar-design-center",
    name: "SanMar Design Center",
    client: "JABS Solutions (SanMar.com)",
    period: "2011 — 2013",
    status: "previous",
    summary:
      "Web platform for designing flyers, brochures and multi-page catalogs of customized products — logos, colors and branding applied per product.",
    highlights: [
      "Built core platform end-to-end",
      "Custom jQuery image editors integrated with Adobe Scene7",
      "PDF and HTML template generation",
    ],
    stack: ["Java", "jQuery", "IBM WebSphere", "Adobe Scene7", "RESTful APIs"],
  },
  {
    slug: "rts-pakistan-railways",
    name: "Railways Tracking System",
    client: "PakVista Technologies — Pakistan Railways",
    period: "2009 — 2011",
    status: "previous",
    summary:
      "Automated train and locomotive tracking with real-time monitoring on OpenLayers maps — location, speed, stations and historical journey playback.",
    highlights: [
      "Managed trains, locomotives, freight, routes and stations",
      "On-site rollout and support for non-technical operators",
    ],
    stack: ["Java", "JSF", "ICEfaces", "Oracle", "MySQL", "OpenLayers"],
  },
];
