#!/bin/bash
# Bash to upload statics to PREE and remove Varnish cache
echo "Connecting to ibcvarwww1.ib"
ssh -i ./keys/WCS_Statics_open ibcomadm@ibcvarwww1.ib << EOF
sudo service rh-varnish4-varnish restart
EOF
echo "Connecting to ibcvarwww2.ib"
ssh -i ./keys/WCS_Statics_open ibcomadm@ibcvarwww2.ib << EOF
sudo service rh-varnish4-varnish restart
EOF
echo "Connecting to ibcvarwww3.ib"
ssh -i ./keys/WCS_Statics_open ibcomadm@ibcvarwww3.ib << EOF
sudo service rh-varnish4-varnish restart
EOF
echo "Connecting to ibcvarwww4.ib"
ssh -i ./keys/WCS_Statics_open ibcomadm@ibcvarwww4.ib << EOF
sudo service rh-varnish4-varnish restart
EOF
echo "=============================================================================================================="
