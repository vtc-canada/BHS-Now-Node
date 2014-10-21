USE `now_management_base`;
DROP procedure IF EXISTS `createMessage`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `createMessage` (IN paramFromUserId INT(11),IN paramToUserId INT(11),IN paramMessage VARCHAR(255),IN paramStatus VARCHAR(45),IN paramSeen TINYINT(1),OUT messageId INT(11))
BEGIN
	INSERT INTO `messages` (`fromUserId`, `toUserId`, `message`, `status`, `seen`, `createdAt`, `updatedAt`) 
VALUES (paramFromUserId, paramToUserId, paramMessage, paramStatus, paramSeen, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET messageId = LAST_INSERT_ID();
END$$

DELIMITER ;

