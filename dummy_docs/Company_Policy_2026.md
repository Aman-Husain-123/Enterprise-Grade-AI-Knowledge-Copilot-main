# KnowledgeForge | Enterprise Policy v1.2 (Internal Only)

## 1. Governance & Compliance
This document outlines the standard operating procedures for the KnowledgeForge AI platform. All users must comply with the Secure Access Provisioning (SAP) protocol when accessing the primary vector indices.

## 2. RAG Processing Limits
The system maintains a context window of 200,000 tokens for real-time Retrieval-Augmented Generation. Documents uploaded as 'Confidential' will undergo triple-redundancy encryption before being chunked and stored in the PostgreSQL-pgvector database.

## 3. Data Retention
By default, conversation logs are stored for 180 days. Metadata-based cleanup occurs automatically every Sunday at 02:00 UTC.

## 4. Contact Information
For security escalations, contact security@knowledgeforge.ai.
