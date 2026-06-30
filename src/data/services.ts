import {
  Banknote,
  Cloud,
  Database,
  Plug,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export const services = [
  {
    icon: Banknote,
    title: "Enterprise Java & Spring",
    summary:
      "Production-grade backends for regulated industries — banking, payments, treasury. TDD, BDD, clean architecture.",
    tags: ["Java", "Spring", "RESTful APIs", "Oracle"],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    summary:
      "Containerized delivery on Kubernetes, OpenShift and AWS/Azure. Pipelines that ship safely, dozens of times a day.",
    tags: ["Kubernetes", "Docker", "Jenkins", "Ansible", "GitLab CI"],
  },
  {
    icon: Database,
    title: "Data & AI Engineering",
    summary:
      "Streaming pipelines, search, and ML-driven insight platforms — from Kafka and Spark to Elasticsearch and NLP.",
    tags: ["Kafka", "Spark", "Elasticsearch", "Python", "NLP"],
  },
  {
    icon: Plug,
    title: "API & System Integration",
    summary:
      "Connect ERPs, banking systems, and third-party platforms with secure, well-documented REST and event APIs.",
    tags: ["REST", "Swagger", "Keycloak", "Vault"],
  },
  {
    icon: RefreshCw,
    title: "Modernization & Refactoring",
    summary:
      "Move legacy estates forward — refactor large codebases, raise test coverage, and stabilize delivery.",
    tags: ["Refactoring", "TDD", "BDD", "Cucumber"],
  },
  {
    icon: ShieldCheck,
    title: "Technical Consulting",
    summary:
      "Architecture review, team enablement, and hands-on delivery for organizations scaling their engineering practice.",
    tags: ["Agile", "XP", "Mentoring", "Code Review"],
  },
];
