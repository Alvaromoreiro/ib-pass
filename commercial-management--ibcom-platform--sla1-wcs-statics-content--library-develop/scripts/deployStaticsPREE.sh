#!/bin/bash
# Bash to upload statics to pree
#/webserver/docs_apache/html/wcs_statics
echo "=============================================================================================================="
echo "Uploading files to ibcvarwwwpre1"
echo "=============================================================================================================="
scp -r -i ./keys/WCS_Statics_open ../dist/wcs_statics/* ibcomadm@ibcvarwwwpre1.ib:/webserver/docs_apache/html/wcs_statics/
echo "=============================================================================================================="
echo "Uploading files to ibcvarwwwpre2"
echo "=============================================================================================================="
scp -r -i ./keys/WCS_Statics_open ../dist/wcs_statics/* ibcomadm@ibcvarwwwpre2.ib:/webserver/docs_apache/html/wcs_statics/
echo "=============================================================================================================="
echo "Execute restart Varnish Cache script"
echo "=============================================================================================================="
sh restartVarnishPREE.sh
