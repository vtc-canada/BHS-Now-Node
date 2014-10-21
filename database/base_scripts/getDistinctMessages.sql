USE `now_management_base`;
DROP procedure IF EXISTS `getDistinctMessages`;
DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getDistinctMessages`(IN v_id INT(11))
BEGIN
	SELECT * 
	FROM (SELECT * 
			FROM ((SELECT *
					,fromUserId AS joinuserId  
					FROM messages 
					WHERE toUserId = v_id
					) 
					UNION 
				  (SELECT *
				  ,toUserId AS joinuserId 
				  FROM messages 
				  WHERE fromUserId = v_id)
				) AS T1 
			ORDER BY createdAt 
			DESC 
		 ) AS T2 
	GROUP BY joinuserId;
END