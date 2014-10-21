USE `now_management_base`;
DROP procedure IF EXISTS `getMessagesByUserId`;

DELIMITER $$
USE `now_management_base`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getMessagesByUserId`(IN v_id INT(11),IN v_where INT(11))
BEGIN
	SELECT * 
	FROM messages 
	WHERE (toUserId = v_id AND fromUserId = v_where) 
		OR (fromUserId = v_id AND toUserId = v_where) 
	ORDER BY createdAt 
	DESC LIMIT 20;
END$$

DELIMITER ;

