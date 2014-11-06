
DROP procedure IF EXISTS `BHS_UTIL_UpdateCurVirtual2Physical`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `BHS_UTIL_UpdateCurVirtual2Physical`(IN p_id INT(11), IN v_id INT(11))
BEGIN
UPDATE cur_virtual_2_physical SET phys_ID = p_id WHERE id = v_id;
END$$

DELIMITER ;
;
