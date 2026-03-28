# KnowledgeForge AI Copilot: Product Specification v0.9 (Pre-Release)

## 1. Core Architecture
KnowledgeForge uses a hybrid-search Reranker (BGE-Small) alongside the principal Embedding model (text-embedding-3-small) to achieve 98.2% Hit Rate (HR@10) on cross-modal documents.

## 2. Key Features
- **Multi-turn RAG:** Full state management for persistent context conversations.
- **Data Connectors:** First-class sync for Figma, GitHub, and Slack via the FastAPI-based connector suite.
- **Vector Sharding:** Automatic partitioning of data indices based on user permissions for multi-tenant isolation.
- **Vision Integration:** Support for PNG/JPG analysis using the gpt-4o-vision model.

## 3. Performance Metrics
- **Avg. Latency:** 1.2s for first chunk (TTFT).
- **Indexing Speed:** 50,000 words per minute on standard Data Scientist VM configurations.
- **Cache Hit Rate:** 35% on repeated prompts via Redis-backed semantic caching.

## 4. Hardware Requirements
- Minimum 8GB RAM for optimized Redis behavior.
- Docker Desktop with WSL2 backend (for Windows hosts).
