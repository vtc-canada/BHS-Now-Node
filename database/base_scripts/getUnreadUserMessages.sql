USE `now_management_base`;
DROP procedure IF EXISTS `getUnreadUserMessages`;

DELIMITER $$
USE `now_management_base`$$
CREATE PROCEDURE `getUnreadUserMessages` (IN paramToUserId INT(11))
BEGIN
	SELECT id, fromUserId, toUserId, message, status, seen, createdAt, updatedAt
 FROM messages 
WHERE 
seen = 0 
AND 
toUserId = paramToUserId;
END$$

DELIMITER ;

