#!/bin/bash
# Bash to upload statics to PREE and remove Varnish cache
echo "Connecting to ibcvarwwwpre1.ib"
ssh -i ./keys/WCS_Statics_open ibcomadm@ibcvarwwwpre1.ib << EOF
sudo service rh-varnish4-varnish restart
EOF
echo "Connecting to ibcvarwwwpre2.ib"
ssh -i ./keys/WCS_Statics_open ibcomadm@ibcvarwwwpre2.ib << EOF
sudo service rh-varnish4-varnish restart
EOF
echo "=============================================================================================================="
