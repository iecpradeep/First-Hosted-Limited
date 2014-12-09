function showblog(portlet)
{portlet.setTitle('RSS')
var content = '<iframe src=http://www.bbr.com/feed/rss-feed-output?feed=bbx-wines width="100%" height="700"></iframe>'
portlet.setHtml( content );}