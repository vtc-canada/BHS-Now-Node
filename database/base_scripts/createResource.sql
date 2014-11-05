
DROP procedure IF EXISTS `createResource`;

CREATE PROCEDURE `createResource` (IN name VARCHAR(255), OUT resourceId INT(11))
BEGIN
	INSERT INTO resources (name, createdAt, updatedAt) VALUES ( name, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET resourceId = LAST_INSERT_ID();
END

