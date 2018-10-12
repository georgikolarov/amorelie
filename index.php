<?php

require "../rbkit/workspace/class/rbdevframework.php";

define('INDEX_PAGE', 'desktop.html');
$currentPage = filter_has_var(INPUT_GET, 'page') ? filter_input(INPUT_GET, 'page', FILTER_SANITIZE_STRING) : INDEX_PAGE;

$api = new rbDevFramework(MEDIAMARKT_PDS);
$api->addContainerFile($currentPage);
$api->render();

include "pds.desktop.inc.html";

