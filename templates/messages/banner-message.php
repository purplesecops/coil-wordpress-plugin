<script type="text/template" id="tmpl-banner-message">
	<div class="coil-banner-message-button">
		<# if ( data.headerLogo ) { #>
				{{{data.headerLogo}}}
			<# } #>
		<# if ( data.button.href ) { #>
			<a target="_blank" href="{{data.button.href}}">{{data.button.text}}</a>
		<# } #>
		<span class="coil-banner-message-dismiss" id="js-coil-banner-dismiss">&times;</span>
	</div>
</script>
