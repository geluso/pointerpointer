BEGIN;

DROP TABLE IF EXISTS saves;
CREATE TABLE saves(
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(180) NOT NULL,
  data LONGTEXT NOT NULL
);

INSERT INTO saves (name, data)
VALUES ("chutes", "chuteschuteschuteschuteschuteschuteschuteschuteschuteschutes"),
  ("plinko", "plinkoplinkoplinkoplinkoplinkoplinkoplinkoplinkoplinkoplinkoplinko"),
  ("crosswalk", "crosswalkcrosswalkcrosswalkcrosswalkcrosswalkcrosswalkcrosswalkcrosswalkcrosswalkcrosswalk");

COMMIT;
