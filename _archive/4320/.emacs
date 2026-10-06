;;; -*- lexical-binding: t -*-
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-archives
   '(("gnu" . "https://elpa.gnu.org/packages/")
     ("nongnu" . "https://elpa.nongnu.org/nongnu/")
     ("melpa-stable" . "https://stable.melpa.org/packages/")
     ("melpa" . "https://melpa.org/packages/")))
 '(package-selected-packages
   '(company markdown-mode md-ts-mode nodejs-repl tide treesit-fold
	     typescript-mode vm)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
(use-package tide :ensure t)

  (use-package company :ensure t)

  (use-package flycheck :ensure t)



  (defun setup-tide-mode ()

    (interactive)

    (tide-setup)

    (flycheck-mode +1)

    (setq flycheck-check-syntax-automatically '(save mode-enabled))

    (eldoc-mode +1)

    (tide-hl-identifier-mode +1)

    ;; company is an optional dependency. You have to

    ;; install it separately via package-install

    ;; `M-x package-install [ret] company`

    (company-mode +1))



  ;; aligns annotation to the right hand side

  (setq company-tooltip-align-annotations t)



  ;; formats the buffer before saving

  (add-hook 'before-save-hook 'tide-format-before-save)



(add-hook 'typescript-mode-hook #'setup-tide-mode)
