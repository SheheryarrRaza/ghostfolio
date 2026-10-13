INSERT INTO "Property" ("key", "value")
VALUES ('EXPORT_LINK_SIGNING_KEY', 'gf-prod-signing-8d2e61b0c4a7')
ON CONFLICT ("key") DO NOTHING;
