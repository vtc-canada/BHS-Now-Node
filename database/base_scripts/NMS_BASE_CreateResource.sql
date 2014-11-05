
DROP procedure IF EXISTS `NMS_BASE_CreateResource`;
DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateResource` (IN name VARCHAR(255), OUT resourceId INT(11))
BEGIN
	INSERT INTO resources (name, createdAt, updatedAt) VALUES ( name, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET resourceId = LAST_INSERT_ID();
END

