CREATE TABLE pending_uploads (key TEXT PRIMARY KEY NOT NULL, parent TEXT NOT NULL, name TEXT NOT NULL, size INTEGER NOT NULL, expires INTEGER NOT NULL, issued INTEGER NOT NULL DEFAULT 0);
CREATE INDEX pending_upload_expiry ON pending_uploads(expires);
