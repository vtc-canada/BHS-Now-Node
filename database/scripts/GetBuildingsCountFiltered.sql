USE cred;
DROP PROCEDURE if EXISTS `GetBuildingsCountFiltered` ;

CREATE PROCEDURE `GetBuildingsCountFiltered`()

#Gets the last value of SQL_CALC_FOUND_ROWS before it was filtered
#This is used for pagination, please note that there could be a race condition
#but this is a proposed solution from the mySQL forums
SELECT FOUND_ROWS() AS filtered_count;